package nicolas.framework.encuestas.Auth;

public class AuthResponse {
    private final String token;

    private AuthResponse(Builder builder) {
        this.token = builder.token;
    }

    public String getToken() {
        return token;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String token;

        public Builder token(String token) {
            this.token = token;
            return this;
        }

        public AuthResponse build() {
            return new AuthResponse(this);
        }
    }
}
