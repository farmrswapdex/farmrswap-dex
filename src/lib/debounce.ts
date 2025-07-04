const debounce = (fn: (...args: unknown[]) => void, timeout = 300) => {
    let timer: NodeJS.Timeout;
    return (...args: unknown[]) => {
        clearTimeout(timer);
        timer = setTimeout(() => { fn.apply(this, args); }, timeout)
    };
}

export default debounce;