package nicolas.framework.encuestas.Exception;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class ApiError {
    private int status;
    private String message;

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public ApiError(int status, String message) {
        this.status = status;
        this.message = message;
    }
}
