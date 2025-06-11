import { Button } from "react-native";
import { ActivityIndicator } from "react-native-paper";

interface LoadingButtonProps {
    title: string;
    onPress: () => void;
    isLoading: boolean;
    color?: string;
}

export default function LoadingButton({
    title,
    onPress,
    isLoading,
    color,
}: LoadingButtonProps) {
    if (isLoading) {
        return <ActivityIndicator size="small" />;
    }
    return <Button title={title} onPress={onPress} color={color} />;
}