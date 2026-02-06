import styles from '../page.module.css';
import { MenuOption } from '@/types/menu';

interface MenuDetailOptionsProps {
    options?: MenuOption[];
}

export default function MenuDetailOptions({ options }: MenuDetailOptionsProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ko-KR').format(price);
    };

    return (
        <div className={styles.optionsSection}>
            <h3 className={styles.sectionTitle}>옵션 정보</h3>
            {options && options.length > 0 ? (
                options.map((option) => (
                    <div key={option.id} className={styles.optionCard}>
                        <div className={styles.optionHeader}>
                            <span className={styles.optionName}>{option.name}</span>
                            {option.required && (
                                <span className={styles.requiredBadge}>필수</span>
                            )}
                        </div>
                        <div className={styles.optionList}>
                            {option.items.map((item) => (
                                <div key={item.id} className={styles.optionItem}>
                                    <span>{item.name}</span>
                                    <span className={styles.itemPrice}>
                                        {item.priceDelta > 0
                                            ? `+${formatPrice(item.priceDelta)}원`
                                            : '무료'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <div className={styles.emptyOptions}>
                    등록된 옵션이 없습니다.
                </div>
            )}
        </div>
    );
}
