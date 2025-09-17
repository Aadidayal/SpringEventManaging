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
        // When: Finding user by existing email
        Optional<User> found = userRepository.findByEmail("john.doe@example.com");
        
        // Then: User should be found with correct details
        assertThat(found).isPresent();
        assertThat(found.get().getFirstName()).isEqualTo("John");
        assertThat(found.get().getEmail()).isEqualTo("john.doe@example.com");
    }

    @Test
    void testFindByEmail_NonExistentUser() {
        // When: Finding user by non-existent email
        Optional<User> found = userRepository.findByEmail("nonexistent@example.com");
        
        // Then: Should return empty Optional
        assertThat(found).isNotPresent();
    }

    @Test
    void testExistsByEmail() {
        // When: Checking email existence
        boolean exists = userRepository.existsByEmail("john.doe@example.com");
        boolean notExists = userRepository.existsByEmail("new@example.com");
        
        // Then: Should correctly identify existing and non-existing emails
        assertThat(exists).isTrue();
        assertThat(notExists).isFalse();
    }

    @Test
    void testSaveNewUser() {
        // Given: New user data
        User newUser = new User();
        newUser.setFirstName("Alice");
        newUser.setLastName("Johnson");
        newUser.setEmail("alice@example.com");
        newUser.setPassword("alice123");
        
        // When: Saving the user
        User saved = userRepository.save(newUser);
        
        // Then: User should be saved with generated ID
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getFirstName()).isEqualTo("Alice");
        assertThat(saved.getEmail()).isEqualTo("alice@example.com");
    }

    @Test
    void testUpdateUser() {
        // Given: Existing user with new data
        testUser.setFirstName("Johnny");
        testUser.setEmail("johnny@example.com");
        
        // When: Updating the user
        User updated = userRepository.save(testUser);
        
        // Then: Changes should be persisted
        assertThat(updated.getFirstName()).isEqualTo("Johnny");
        assertThat(updated.getEmail()).isEqualTo("johnny@example.com");
        
        // Verify by finding again
        Optional<User> found = userRepository.findById(testUser.getId());
        assertThat(found.get().getFirstName()).isEqualTo("Johnny");
    }

    @Test
    void testDeleteUser() {
        // Given: User ID to delete
        Long userId = testUser.getId();
        
        // When: Deleting the user
        userRepository.deleteById(userId);
        
        // Then: User should no longer exist
        assertThat(userRepository.findById(userId)).isNotPresent();
        assertThat(userRepository.existsByEmail("john.doe@example.com")).isFalse();
    }

    @Test
    void testEmailUniquenessConstraint() {
        // Given: User with duplicate email
        User duplicate = new User();
        duplicate.setFirstName("Jane");
        duplicate.setLastName("Smith");
        duplicate.setEmail("john.doe@example.com"); // Same email as testUser
        duplicate.setPassword("jane123");
        
        // When/Then: Should throw exception for duplicate email
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
        
        // When: Finding admin user
        Optional<User> foundAdmin = userRepository.findByEmail("admin@company.com");
        
        // Then: Should identify admin correctly
        assertThat(foundAdmin).isPresent();
        assertThat(foundAdmin.get().getFirstName().toLowerCase()).isEqualTo("admin");
        assertThat(foundAdmin.get().getEmail()).contains("admin");
    }

    @Test
    void testUserCount() {
        // When: Counting users
        long count = userRepository.count();
        
        // Then: Should return correct count
        assertThat(count).isEqualTo(1); // Only testUser from setUp
        
        // Add another user and verify count increases
        User newUser = new User();
        newUser.setFirstName("Test");
        newUser.setLastName("User");
        newUser.setEmail("test@example.com");
        newUser.setPassword("test123");
        userRepository.save(newUser);
        
        assertThat(userRepository.count()).isEqualTo(2);
    }
}