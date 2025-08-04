package nicolas.framework.encuestas.encuesta.dtos;

public class BankInputDTO {
    private String extension;
    private String logoBase64;
    private String nombre;

    public BankInputDTO() { }

    public BankInputDTO(String extension, String logoBase64, String nombre) {
        this.extension = extension;
        this.logoBase64 = logoBase64;
        this.nombre = nombre;
    }

    public String getExtension() {
        return extension;
    }

    public void setExtension(String extension) {
        this.extension = extension;
    }

    public String getLogoBase64() {
        return logoBase64;
    }

    public void setLogoBase64(String logoBase64) {
        this.logoBase64 = logoBase64;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}
