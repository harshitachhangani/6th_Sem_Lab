
import java.util.*;

/*
 * Here's how you can provide input for the program:

Enter the encryption/decryption key (as binary string): 1100110011001100
Enter the plaintext/ciphertext (as binary string): 1010101010101010
Enter 1 to encrypt and 2 to decrypt: 1
After entering this input, the program should output the encrypted ciphertext in binary.

For decryption, let's use the encrypted ciphertext from the previous step:

Enter the encryption/decryption key (as binary string): 1100110011001100
Enter the plaintext/ciphertext (as binary string): 1100101011101111 (This is the encrypted ciphertext from the previous step)
Enter 1 to encrypt and 2 to decrypt: 2
After entering this input, the program should output the decrypted plaintext in binary.
 */

public class AES {
    private static final int[] sBox = { 0x9, 0x4, 0xA, 0xB, 0xD, 0x1, 0x8, 0x5, 0x6, 0x2, 0x0, 0x3, 0xC, 0xE, 0xF, 0x7 };
    private static final int[] sBoxI = { 0xA, 0x5, 0x9, 0xB, 0x1, 0x7, 0x8, 0xF, 0x6, 0x0, 0x2, 0x3, 0xC, 0x4, 0xD, 0xE };
    private int[] preRoundKey;
    private int[] round1Key;
    private int[] round2Key;

    // Substitutes bytes using the S-Box
    private int subWord(int word) {
        return (sBox[(word >> 4)] << 4) + sBox[word & 0x0F];
    }

    // Rotates a word by one byte
    private int rotWord(int word) {
        return ((word & 0x0F) << 4) + ((word & 0xF0) >> 4);
    }

    // Generates round keys from the master key
    public void keygen(int key) {
        int Rcon1 = 0x80;
        int Rcon2 = 0x30;

        int[] w = new int[6];
        w[0] = (key & 0xFF00) >> 8;
        w[1] = key & 0x00FF;
        w[2] = w[0] ^ (subWord(rotWord(w[1])) ^ Rcon1);
        w[3] = w[2] ^ w[1];
        w[4] = w[2] ^ (subWord(rotWord(w[3])) ^ Rcon2);
        w[5] = w[4] ^ w[3];

        preRoundKey = intToState((w[0] << 8) + w[1]);
        round1Key = intToState((w[2] << 8) + w[3]);
        round2Key = intToState((w[4] << 8) + w[5]);

    }

   

    // Helper method to print a key
    
    //  // Performs multiplication 
    private int gfMult(int a, int b) {
        int product = 0;

        a = a & 0x0F;
        b = b & 0x0F;

        while (a != 0 && b != 0) {
            if ((b & 1) == 1) {
                product ^= a;
            }
            a <<= 1;
            if ((a & (1 << 4)) != 0) {
                a ^= 0b10011;
            }
            b >>= 1;
        }
        return product;
    }

     // Converts an integer to a 4-byte state array

    private int[] intToState(int n) {
        int[] state = new int[4];
        state[0] = (n >> 12) & 0xF;
        state[1] = (n >> 4) & 0xF;
        state[2] = (n >> 8) & 0xF;
        state[3] = n & 0xF;
        return state;
    }

        // Converts a 4-byte state array to an integer

    private int stateToInt(int[] m) {
        return (m[0] << 12) + (m[1] << 4) + (m[2] << 8) + m[3];
    }

        // Adds round keys to the state
        private int[] addRoundKey(int[] s1, int[] s2) {
            int[] result = new int[4];
            for (int i = 0; i < 4; i++) {
                result[i] = s1[i] ^ s2[i];
            }
            return result;
        }

        // Substitutes bytes using a given S-Box
        private int[] subNibbles(int[] sbox, int[] state) {
            int[] result = new int[4];
            for (int i = 0; i < 4; i++) {
                result[i] = sbox[state[i]];
            }
            return result;
        }

        // Shifts rows in the state
        private int[] shiftRows(int[] state) {
            return new int[] { state[0], state[1], state[3], state[2] };
        }

     // Mixes columns in the state
     private int[] mixColumns(int[] state) {
        return new int[] {
            state[0] ^ gfMult(4, state[2]),
            state[1] ^ gfMult(4, state[3]),
            state[2] ^ gfMult(4, state[0]),
            state[3] ^ gfMult(4, state[1])
        };
    }

    // Inverse mix columns in the state
    private int[] inverseMixColumns(int[] state) {
        return new int[] {
            gfMult(9, state[0]) ^ gfMult(2, state[2]),
            gfMult(9, state[1]) ^ gfMult(2, state[3]),
            gfMult(9, state[2]) ^ gfMult(2, state[0]),
            gfMult(9, state[3]) ^ gfMult(2, state[1])
        };
    }

     
   

    public int encrypt(int plaintext) {
        int[] state = addRoundKey(preRoundKey, intToState(plaintext));
        state = mixColumns(shiftRows(subNibbles(sBox, state)));
        state = addRoundKey(round1Key, state);
        state = shiftRows(subNibbles(sBox, state));
        state = addRoundKey(round2Key, state);
        return stateToInt(state);
    }

    public int decrypt(int ciphertext) {
        int[] state = addRoundKey(round2Key, intToState(ciphertext));
        state = subNibbles(sBoxI, shiftRows(state));
        state = inverseMixColumns(addRoundKey(round1Key, state));
        state = subNibbles(sBoxI, shiftRows(state));
        state = addRoundKey(preRoundKey, state);
        return stateToInt(state);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.println("AES Encryption/Decryption Tool");
        System.out.print("Enter the encryption/decryption key (as binary string): ");
        String keyInput = sc.nextLine().trim();

        if (keyInput.length() != 16) {
            System.out.println("Key must be a binary string of length 16.");
            return;
        }

        int key = Integer.parseInt(keyInput, 2);

        AES aes = new AES();
        aes.keygen(key);

        System.out.print("Enter the plaintext/ciphertext (as binary string): ");
        String textInput = sc.nextLine().trim();

        if (textInput.length() != 16) {
            System.out.println("Text must be a binary string of length 16.");
            return;
        }

        aes.printKeys();

        int text = Integer.parseInt(textInput, 2);

        System.out.print("Enter 1 to encrypt the data: ");
        int choice = sc.nextInt();

        int result = 0;

        switch (choice) {
            case 1:
                result = aes.encrypt(text);
                System.out.print("Encrypted ciphertext (in binary): ");
                break;
            case 2:
                result = aes.decrypt(text);
                System.out.print("Decrypted plaintext (in binary): ");
                break;
            default:
                System.out.println("Invalid choice.");
                return;
        }

        printBinary(result, 16);

        sc.close();
    }

          // Prints a binary number with a specified number of bits

    public static void printBinary(int num, int numBits) {
        String binaryString = Integer.toBinaryString(num);

        while (binaryString.length() < numBits) {
            binaryString = "0" + binaryString;
        }

        System.out.println(binaryString);
    }
}