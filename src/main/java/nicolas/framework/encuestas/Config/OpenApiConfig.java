package nicolas.framework.encuestas.Config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API de Encuestas")
                        .version("1.0.0")
                        .description("Documentación de la API para gestión de encuestas de satisfacción")
                        .contact(new Contact()
                                .name("Nicolás Longo")
                                .email("nicolas.longo@accenture.com")
                        )
                );
    }
}