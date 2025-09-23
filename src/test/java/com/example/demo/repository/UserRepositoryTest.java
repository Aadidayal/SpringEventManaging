package com.example.demo.repository;

import com.example.demo.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import java.util.Optional;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;


@DataJpaTest
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TestEntityManager entityManager;

    private User testUser;

    @BeforeEach
    void setUp() {
        userRepository.deleteAllInBatch();
        
        testUser = new User();
        testUser.setFirstName("John");
        testUser.setLastName("Doe");
        testUser.setEmail("john.doe@example.com");
        testUser.setPassword("password123");
        
        entityManager.persist(testUser);
        entityManager.flush();
        entityManager.clear();
    }

    @Test
    void testFindByEmail_ExistingUser() {
        Optional<User> found = userRepository.findByEmail("john.doe@example.com");
        assertThat(found).isPresent();
        assertThat(found.get().getFirstName()).isEqualTo("John");
        assertThat(found.get().getEmail()).isEqualTo("john.doe@example.com");
    }

    @Test
    void testFindByEmail_NonExistentUser() {
        Optional<User> found = userRepository.findByEmail("nonexistent@example.com");
        assertThat(found).isNotPresent();
    }

    @Test
    void testExistsByEmail() {
        boolean exists = userRepository.existsByEmail("john.doe@example.com");
        boolean notExists = userRepository.existsByEmail("new@example.com");
        
        assertThat(exists).isTrue();
        assertThat(notExists).isFalse();
    }

    @Test
    void testSaveNewUser() {
        User newUser = new User();
        newUser.setFirstName("Alice");
        newUser.setLastName("Johnson");
        newUser.setEmail("alice@example.com");
        newUser.setPassword("alice123");
        
        User saved = userRepository.save(newUser);
        
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getFirstName()).isEqualTo("Alice");
        assertThat(saved.getEmail()).isEqualTo("alice@example.com");
    }

    @Test
    void testUpdateUser() {
        testUser.setFirstName("Johnny");
        testUser.setEmail("johnny@example.com");
        
        User updated = userRepository.save(testUser);
        
        assertThat(updated.getFirstName()).isEqualTo("Johnny");
        assertThat(updated.getEmail()).isEqualTo("johnny@example.com");
        
        Optional<User> found = userRepository.findById(testUser.getId());
        assertThat(found.get().getFirstName()).isEqualTo("Johnny");
    }

    @Test
    void testDeleteUser() {
        Long userId = testUser.getId();
        
        userRepository.deleteById(userId);

        assertThat(userRepository.findById(userId)).isNotPresent();
        assertThat(userRepository.existsByEmail("john.doe@example.com")).isFalse();
    }

    @Test
    void testEmailUniquenessConstraint() {
        User duplicate = new User();
        duplicate.setFirstName("Jane");
        duplicate.setLastName("Smith");
        duplicate.setEmail("john.doe@example.com"); // Same email as testUser
        duplicate.setPassword("jane123");
        
        assertThrows(
            org.springframework.dao.DataIntegrityViolationException.class,
            () -> userRepository.saveAndFlush(duplicate)
        );
    }

    @Test
    void testAdminUserIdentification() {
        // Given: Admin user
        User admin = new User();
        admin.setFirstName("admin");
        admin.setLastName("User");
        admin.setEmail("admin@company.com");
        admin.setPassword("admin123");
        userRepository.save(admin);
        
        Optional<User> foundAdmin = userRepository.findByEmail("admin@company.com");

        assertThat(foundAdmin).isPresent();
        assertThat(foundAdmin.get().getFirstName().toLowerCase()).isEqualTo("admin");
        assertThat(foundAdmin.get().getEmail()).contains("admin");
    }

    @Test
    void testUserCount() {
        long count = userRepository.count();
     
        assertThat(count).isEqualTo(1); 
        
       
        User newUser = new User();
        newUser.setFirstName("Test");
        newUser.setLastName("User");
        newUser.setEmail("test@example.com");
        newUser.setPassword("test123");
        userRepository.save(newUser);
        
        assertThat(userRepository.count()).isEqualTo(2);
    }
}