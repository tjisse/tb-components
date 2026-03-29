package com.example.tbapi.config;

import com.example.tbapi.model.Address;
import com.example.tbapi.model.Role;
import com.example.tbapi.model.User;
import com.example.tbapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            userRepository.saveAll(List.of(
                    User.builder().name("John Doe").email("john.doe@example.com").role(Role.ADMIN).address(new Address("New York", "Broadway")).build(),
                    User.builder().name("Jane Smith").email("jane.smith@example.com").role(Role.USER).address(new Address("Los Angeles", "Sunset Blvd")).build(),
                    User.builder().name("Alice Johnson").email("alice.johnson@example.com").role(Role.USER).address(new Address("Chicago", "Michigan Ave")).build(),
                    User.builder().name("Bob Williams").email("bob.williams@example.com").role(Role.EDITOR).address(new Address("Houston", "Main St")).build(),
                    User.builder().name("Charlie Brown").email("charlie.brown@example.com").role(Role.USER).address(new Address("Phoenix", "Central Ave")).build(),
                    User.builder().name("David Miller").email("david.miller@example.com").role(Role.ADMIN).address(new Address("Philadelphia", "Market St")).build(),
                    User.builder().name("Eve Wilson").email("eve.wilson@example.com").role(Role.EDITOR).address(new Address("San Antonio", "River Walk")).build(),
                    User.builder().name("Frank Davis").email("frank.davis@example.com").role(Role.USER).address(new Address("San Diego", "Broadway")).build(),
                    User.builder().name("Grace Moore").email("grace.moore@example.com").role(Role.USER).address(new Address("Dallas", "Elm St")).build(),
                    User.builder().name("Henry Taylor").email("henry.taylor@example.com").role(Role.ADMIN).address(new Address("San Jose", "First St")).build(),
                    User.builder().name("Ivy Anderson").email("ivy.anderson@example.com").role(Role.USER).address(new Address("Austin", "Congress Ave")).build(),
                    User.builder().name("Jack Thomas").email("jack.thomas@example.com").role(Role.EDITOR).address(new Address("Jacksonville", "Main St")).build()
            ));
        }
    }
}
