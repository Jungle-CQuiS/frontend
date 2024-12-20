import { useEffect ,useState} from 'react';
import { StyledAnimatedEmoji } from './styled';

interface AnimatedEmojiProps {
    src: string;
    startX: number;
    startY: number;
}

// 애니메이션이 끝나면 컴포넌트를 제거하기 위한 상태 관리

export const AnimatedEmoji = ({ src, startX, startY }: AnimatedEmojiProps) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <StyledAnimatedEmoji
            src={src}
            $startX={startX}  // styled-components prop으로 변경
            $startY={startY}  // styled-components prop으로 변경
        />
    );
};