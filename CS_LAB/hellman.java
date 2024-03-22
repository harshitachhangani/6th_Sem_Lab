import java.math.BigInteger;
import java.util.Scanner;

public class hellman {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter a prime number P: ");
        BigInteger P = sc.nextBigInteger();

        System.out.print("Enter a primitive root for P (G): ");
        BigInteger G = sc.nextBigInteger();

        System.out.print("Enter the private key for Alice (a): ");
        BigInteger a = sc.nextBigInteger();

        System.out.print("Enter the private key for Bob (b): ");
        BigInteger b = sc.nextBigInteger();

        // Calculate Alice's public key
        BigInteger publicKeyAlice = G.modPow(a, P);

        // Calculate Bob's public key
        BigInteger publicKeyBob = G.modPow(b, P);

        System.out.println("Shared ECC Public Key for Alice: " + publicKeyAlice);
        System.out.println("Shared ECC Public Key for Bob: " + publicKeyBob);

        System.out.println("Diffie-Hellman Key Exchange:");
        BigInteger sharedSecretAlice = publicKeyBob.modPow(a, P);
        BigInteger sharedSecretBob = publicKeyAlice.modPow(b, P);

        System.out.println("Shared Secret for Alice: " + sharedSecretAlice);
        System.out.println("Shared Secret for Bob: " + sharedSecretBob);
    }
}
