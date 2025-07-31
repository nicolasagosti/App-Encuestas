package nicolas.framework.encuestas.Auth;

public class AuthResponse {
    private final String token;
    private final boolean mustChangePassword;

    private AuthResponse(Builder builder) {
        this.token = builder.token;
        this.mustChangePassword = builder.mustChangePassword;
    }

    public String getToken() {
        return token;
    }

    public boolean isMustChangePassword() {
        return mustChangePassword;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String token;
        private boolean mustChangePassword;

        /** El token JWT para el usuario */
        public Builder token(String token) {
            this.token = token;
            return this;
        }

        /** Indicador de si el usuario debe cambiar la contraseña en el próximo login */
        public Builder mustChangePassword(boolean mustChangePassword) {
            this.mustChangePassword = mustChangePassword;
            return this;
        }

        public AuthResponse build() {
            return new AuthResponse(this);
        }
    }
}
