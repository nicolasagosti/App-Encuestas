// src/main/java/nicolas/framework/encuestas/encuesta/services/BankService.java
package nicolas.framework.encuestas.encuesta.services;

import nicolas.framework.encuestas.encuesta.dtos.BankInputDTO;

import nicolas.framework.encuestas.encuesta.models.entities.Bank;
import nicolas.framework.encuestas.encuesta.models.repositories.BankRepository;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;

@Service
public class BankService implements IBankService{

    private final BankRepository bankRepository;

    public BankService(BankRepository bankRepository) {
        this.bankRepository = bankRepository;
    }

    public BankInputDTO addBank(String extension, MultipartFile logo) throws IOException {
        String ext = extension.trim().toLowerCase();
        if (!StringUtils.hasText(ext)) {
            throw new IllegalArgumentException("La extensión no puede estar vacía");
        }

        byte[] logoBytes = logo.getBytes();
        String logoBase64 = Base64.getEncoder().encodeToString(logoBytes);

        Bank bank = new Bank(ext, logoBase64);
        bankRepository.save(bank);

        return new BankInputDTO(ext, logoBase64);
    }

    public BankInputDTO getBank(String extension) {
        String ext = extension.trim().toLowerCase();
        return bankRepository.findById(ext)
                .map(b -> new BankInputDTO(b.getExtension(), b.getLogoBase64()))
                .orElse(null);
    }
}

