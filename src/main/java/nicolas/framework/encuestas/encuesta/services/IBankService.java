package nicolas.framework.encuestas.encuesta.services;

import nicolas.framework.encuestas.encuesta.dtos.BankInputDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface IBankService {
    public BankInputDTO addBank(String extension, MultipartFile logo) throws IOException;
    public BankInputDTO getBank(String extension);
}
