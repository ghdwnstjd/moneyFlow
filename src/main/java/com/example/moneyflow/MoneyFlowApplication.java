package com.example.moneyflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableJpaAuditing
@EnableScheduling
@EnableAspectJAutoProxy
@SpringBootApplication
public class MoneyFlowApplication {

	public static void main(String[] args) {
		SpringApplication.run(MoneyFlowApplication.class, args);
	}

}
