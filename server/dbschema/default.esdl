module default {
    type User {
        required property username -> str {
            constraint exclusive;
        }
        required property email -> str {
            constraint exclusive;
        }
        required property password -> str;
        required property createdAt -> datetime {
            default := datetime_current()
        }
        required property updatedAt -> datetime {
            default := datetime_current()
        }
        multi link refreshTokens -> RefreshToken {
            on target delete delete source;
        }
    }

    type RefreshToken {
        required property hashedToken -> str;
        required property jti -> uuid {
            constraint exclusive;
        }
        link user -> User;
        required property revoked -> bool {
            default := false;
        }
        required property createdAt -> datetime {
            default := datetime_current();
        }
        required property updatedAt -> datetime {
            default := datetime_current();
        }
    }
}
