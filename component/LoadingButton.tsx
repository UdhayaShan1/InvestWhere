import { Button } from "react-native";
import { ActivityIndicator } from "react-native-paper";

interface LoadingButtonProps {
    title:string;
    onPress: () => void;
    isLoading:boolean;
}

export default function LoadingButton({title, onPress, isLoading} : LoadingButtonProps) {
    if (isLoading) {
        return <ActivityIndicator size="small" />
    }
    return <Button title={title} onPress={onPress}></Button>
}