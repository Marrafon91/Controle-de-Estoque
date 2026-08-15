package https.github.com.fernandesdennys.dispensa;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class DispensaApplication {

	public static void main(String[] args) {
		SpringApplication.run(DispensaApplication.class, args);
	}

}
