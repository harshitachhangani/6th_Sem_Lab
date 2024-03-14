
// Import necessary libraries for the code
import javax.crypto.KeyAgreement; // Used for Diffie-Hellman key agreement
import javax.crypto.interfaces.DHPublicKey; // Used for Diffie-Hellman public keys
import javax.crypto.spec.DHParameterSpec; // Used for Diffie-Hellman parameters
import java.security.*; // Used for cryptographic operations and key generation
import java.util.Arrays; // Used to work with arrays and compare shared secrets

public class DiffieHellman {
    public static void main(String[] args) throws Exception {

        KeyPair aliceKeyPair = generateKeyPair();
        PublicKey alicePublicKey = aliceKeyPair.getPublic();
        PrivateKey alicePrivateKey = aliceKeyPair.getPrivate();

        KeyPair bobKeyPair = generateKeyPair();
        PublicKey bobPublicKey = bobKeyPair.getPublic();
        PrivateKey bobPrivateKey = bobKeyPair.getPrivate();

        // Create a KeyAgreement object for Alice
        KeyAgreement aliceKeyAgreement = KeyAgreement.getInstance("DiffieHellman");
        aliceKeyAgreement.init(alicePrivateKey);

        // Perform the key exchange with Bob's public key
        aliceKeyAgreement.doPhase(bobPublicKey, true);

        // Create a KeyAgreement object for Bob
        KeyAgreement bobKeyAgreement = KeyAgreement.getInstance("DiffieHellman");
        bobKeyAgreement.init(bobPrivateKey);

        // Perform the key exchange with Alice's public key
        bobKeyAgreement.doPhase(alicePublicKey, true);

        // Generate shared secrets for both Alice and Bob
        byte[] aliceSharedSecret = aliceKeyAgreement.generateSecret();
        byte[] bobSharedSecret = bobKeyAgreement.generateSecret();

        // Print the shared secrets and check if they match
        System.out.println("Alice's shared secret: " + Arrays.toString(aliceSharedSecret));
        System.out.println("Bob's shared secret: " + Arrays.toString(bobSharedSecret));
        System.out.println("Shared secrets match: " + Arrays.equals(aliceSharedSecret, bobSharedSecret));
    }

    // Function to generate a Diffie-Hellman key pair
    private static KeyPair generateKeyPair() throws Exception {
        KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("DiffieHellman");
        keyPairGenerator.initialize(1024); // Key size (in bits)
        return keyPairGenerator.generateKeyPair();
    }
}