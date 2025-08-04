package nicolas.framework.encuestas.encuesta.services;

import nicolas.framework.encuestas.encuesta.dtos.BankInputDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface IBankService {
    public BankInputDTO addBank(String extension,String nombre, MultipartFile logo) throws IOException;
    public BankInputDTO getBank(String extension);
    public List<BankInputDTO> getBanks();

}
