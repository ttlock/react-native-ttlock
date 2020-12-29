import Toast from 'react-native-root-toast';

var toast: Toast | undefined;

export function showToast(text: string) {
    showToastDuration(text, 5 * 1000);
}

export function showToastLoad(text: string) {
    showToastDuration(text, 24 * 1000 * 1000);
}

export function hidden() {
    if (toast !== undefined) {
        Toast.hide(toast);
        toast = undefined;
    }
}

function showToastDuration(text: string, duration: number) {
    if (toast !== undefined) {
        Toast.hide(toast);
        toast = undefined;
    }
    toast = Toast.show(text, {
        position: Toast.positions.CENTER,
        duration: duration,
    });
}