const debounce = <T extends (...args: any[]) => void>(fn: T, timeout = 300) => {
    let timer: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timer);
        timer = setTimeout(() => { fn.apply(this, args); }, timeout)
    };
}

export default debounce;