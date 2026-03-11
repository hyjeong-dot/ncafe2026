import os
import psycopg2
from psycopg2.extras import RealDictCursor
import numpy as np
from sentence_transformers import SentenceTransformer
from app.config import EMBEDDING_MODEL_NAME, EMBEDDING_DIMENSION
import logging

logger = logging.getLogger(__name__)

# Initialize model
# Note: This might download models on the first run.
model = SentenceTransformer(EMBEDDING_MODEL_NAME)

def get_db_connection():
    # config.py를 거치지 않고 직접 환경변수에서 읽어옵니다. (없으면 기본값 사용)
    # 이렇게 하면 코드가 훨씬 더 간결해지고 보안상 유리합니다.
    return psycopg2.connect(
        dbname=os.getenv("DB_NAME", "ncafedb"),
        user=os.getenv("SPRING_DATASOURCE_USERNAME", "ncafe"),
        password=os.getenv("DB_PASSWORD", ""),
        host=os.getenv("DB_HOST", "db"),
        port=os.getenv("DB_PORT", "5432")
    )

def init_db():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # 1. Ensure pgvector extension
        cur.execute("CREATE EXTENSION IF NOT EXISTS vector;")
        
        # 2. Create documents table with vector support
        cur.execute(f"""
            CREATE TABLE IF NOT EXISTS docs (
                id SERIAL PRIMARY KEY,
                content TEXT NOT NULL,
                embedding vector({EMBEDDING_DIMENSION})
            );
        """)
        
        conn.commit()
        cur.close()
        conn.close()
        logger.info("RAG DB initialized.")
    except Exception as e:
        logger.error(f"Error initializing RAG DB: {e}")

# Initial run
init_db()

def get_embedding(text: str) -> list[float]:
    # e5 model passage prefix
    passage_text = f"passage: {text}"
    embedding = model.encode(passage_text)
    return embedding.tolist()

def add_document(content: str):
    embedding = get_embedding(content)
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO docs (content, embedding) VALUES (%s, %s) RETURNING id;",
            (content, embedding)
        )
        doc_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        return doc_id
    except Exception as e:
        logger.error(f"Error adding document: {e}")
        return None

def get_all_documents():
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT id, content FROM docs ORDER BY id DESC;")
        docs = cur.fetchall()
        cur.close()
        conn.close()
        return docs
    except Exception as e:
        logger.error(f"Error fetching documents: {e}")
        return []

def update_document(doc_id: int, content: str):
    embedding = get_embedding(content)
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "UPDATE docs SET content = %s, embedding = %s WHERE id = %s;",
            (content, embedding, doc_id)
        )
        conn.commit()
        cur.close()
        conn.close()
        return True
    except Exception as e:
        logger.error(f"Error updating document: {e}")
        return False

def delete_document(doc_id: int):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM docs WHERE id = %s;", (doc_id,))
        conn.commit()
        cur.close()
        conn.close()
        return True
    except Exception as e:
        logger.error(f"Error deleting document: {e}")
        return False

def search_similar_documents(query: str, limit: int = 3):
    # e5 model query prefix
    query_text = f"query: {query}"
    query_embedding = model.encode(query_text).tolist()
    
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        # Using vector cosine distance (<=>)
        cur.execute(f"""
            SELECT content FROM docs
            ORDER BY embedding <=> %s::vector
            LIMIT %s;
        """, (query_embedding, limit))
        results = cur.fetchall()
        cur.close()
        conn.close()
        return [r['content'] for r in results]
    except Exception as e:
        logger.error(f"Error during vector search: {e}")
        return []

def search_menu_by_name(menu_name: str):
    """실제 DB에서 메뉴 이름으로 ID를 검색합니다."""
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        # 한글 이름 또는 영어 이름으로 검색
        cur.execute("""
            SELECT id, kor_name FROM menus 
            WHERE kor_name LIKE %s OR eng_name LIKE %s
            LIMIT 1;
        """, (f"%{menu_name}%", f"%{menu_name}%"))
        result = cur.fetchone()
        cur.close()
        conn.close()
        return result if result else None
    except Exception as e:
        logger.error(f"Error searching menu by name: {e}")
        return None
