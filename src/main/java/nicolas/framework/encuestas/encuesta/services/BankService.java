package nicolas.framework.encuestas.encuesta.services;

import nicolas.framework.encuestas.encuesta.dtos.BankInputDTO;
import nicolas.framework.encuestas.encuesta.models.entities.Bank;
import nicolas.framework.encuestas.encuesta.models.repositories.BankRepository;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;

@Service
public class BankService implements IBankService {

    private final BankRepository bankRepository;

    public BankService(BankRepository bankRepository) {
        this.bankRepository = bankRepository;
    }

    public BankInputDTO addBank(String extension, String nombre, MultipartFile logo) throws IOException {
        String ext = extension.trim().toLowerCase();
        if (!StringUtils.hasText(ext)) {
            throw new IllegalArgumentException("La extensión no puede estar vacía");
        }

        byte[] logoBytes = logo.getBytes();
        String logoBase64 = Base64.getEncoder().encodeToString(logoBytes);

        Bank bank = new Bank(ext, nombre, logoBase64);
        bankRepository.save(bank);

        return new BankInputDTO(ext, nombre, logoBase64);
    }

    public BankInputDTO getBank(String extension) {
        String ext = extension.trim().toLowerCase();
        return bankRepository.findById(ext)
                .map(b -> new BankInputDTO(b.getExtension(), b.getNombre(), b.getLogoBase64()))
                .orElse(null);
    }

    @Override
    public List<BankInputDTO> getBanks() {
        return bankRepository.findAll().stream()
                .map(b -> new BankInputDTO(b.getExtension(), b.getNombre(), b.getLogoBase64()))
                .toList();
    }

    public String obtenerExtension(String nombre) {
        Bank banco = bankRepository.findTopByExtension(nombre);
        if (banco == null) {
            throw new IllegalArgumentException("Banco no encontrado: " + nombre);
        }
        return banco.getExtension();
    }


    @Override
    public void cargarBancoDesdeCargaInicial(String extension, String nombre, String base64logo) {
        if (bankRepository.existsByExtension(extension)) return;
        Bank banco = new Bank();
        banco.setExtension(extension);
        banco.setNombre(nombre);
        banco.setLogoBase64(base64logo != null ? base64logo : "");
        bankRepository.save(banco);
    }


}
