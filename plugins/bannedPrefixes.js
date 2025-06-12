bannedPrefixes.some(prefix =>
    typeof prefix === "string"
        ? message.startsWith(prefix)
        : prefix.test(message)
)