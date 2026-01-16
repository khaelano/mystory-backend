import "dotenv/config";

function required(key: string): string {
    const value = process.env[key];
    if (!value) {
        console.error(`Missing required environment variable: ${key}`);
        process.exit(1);
    }
    return value;
}

function optional(key: string, defaultValue: string): string {
    return process.env[key] ?? defaultValue;
}

function number(key: string, defaultValue: number): number {
    const value = process.env[key];
    if (!value) return defaultValue;

    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
        console.error(`Invalid number for environment variable: ${key}`);
        process.exit(1);
    }
    return parsed;
}

export const config = {
    port: number("PORT", 8080),
    nodeEnv: optional("NODE_ENV", "development"),

    database: {
        url: required("DATABASE_URL"),
    },

    r2: {
        endpoint: required("R2_ENDPOINT"),
        accessKeyId: required("R2_ACCESS_KEY_ID"),
        secretAccessKey: required("R2_SECRET_ACCESS_KEY"),
        bucketName: required("R2_BUCKET_NAME"),
        publicUrl: required("R2_PUBLIC_URL"),
    },
} as const;
