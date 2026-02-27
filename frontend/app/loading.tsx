import LoadingDitto from '@/components/common/LoadingDitto/LoadingDitto';

export default function Loading() {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80vh'
        }}>
            <LoadingDitto
                message="메타몽이 카페를 준비하고 있어요... 💜"
                size={320}
            />
        </div>
    );
}
