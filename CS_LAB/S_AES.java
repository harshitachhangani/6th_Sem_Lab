// import java.util.Arrays;
import java.util.Scanner;
// import java.util.*;
// import java.util.regex.*;

public class S_AES {

	private static final String[][] SBOX = { {"1001","0100","1010","1011"},{"1101","0001","1000","0101"},{"0110","0010","0000","0011"},{"1100","1110","1111","0111"} };
	private static final String[][] SBOX_INV = { {"1010","0101","1001","1011"},{"0001","0111","1000","1111"},{"0110","0000","0010","0011"},{"1100","0100","1101","1110"} };
	private static String key0 = null, key1 = null, key2 = null;
	private static int encryptionConstantMatrix[][] = { {1, 4}, {4, 1} };
	private static int decryptionConstantMatrix[][] = { {9, 2}, {2, 9} };

	public S_AES(String key) {
		generateKeys(key);
	}

	private int binaryToDecimal(String binary) {
		return Integer.parseInt(binary, 2);
	}

	private String decimalToBinary(int decimal, int binaryStringSize) {
		return String.format("%" + binaryStringSize + "s", Integer.toBinaryString(decimal & 0xFF)).replace(' ', '0');
	}

	public String stringXOR(String a, String b) {
		StringBuilder sb = new StringBuilder();
		for(int i = 0; i < a.length(); i++) {
    		sb.append(a.charAt(i) ^ b.charAt(i));
		}
		return sb.toString();
	}

	private int gfMul(int a, int b) {
        int product = 0; //the product of the multiplication
            
        while (b > 0) {
            if ((b & 1) != 0) //if b is odd then add the first num i.e a into product result
                product = product ^ a;
            
            a = a << 1; //double first num

            //if a overflows beyond 4th bit
            if ((a & (1 << 4)) != 0)
                a = a ^ 0b10011; // XOR with irreducible polynomial with high term eliminated
            
            b = b >> 1; //reduce second num
        }
        return product;
    }

	private String nibbleSubstitution(String input, String[][] SBOX) {
		StringBuilder sb = new StringBuilder();
		for(int i = 0 ; i < input.length() / 4 ; i++) {
			String str = input.substring(i*4, (i*4)+4);
			sb.append(SBOX[binaryToDecimal(str.substring(0,2))][binaryToDecimal(str.substring(2,4))]);
		}
		return sb.toString();
	}

	private String shiftRow(String str) {
		// Swap 2nd and 4th nibble
		StringBuilder sb = new StringBuilder();
		sb.append(str.substring(0,4));
		sb.append(str.substring(12, 16));
		sb.append(str.substring(8,12));
		sb.append(str.substring(4,8));
		return sb.toString();
	}

	private String rotateNibble(String word) {
		return word.substring(4,8) + word.substring(0,4);
	}

	private void generateKeys(String key) {
		String w0 = key.substring(0,8);
		String w1 = key.substring(8,16);
		String w2 = stringXOR(stringXOR(w0, "10000000"), nibbleSubstitution(rotateNibble(w1), SBOX));
		String w3 = stringXOR(w2, w1);
		String w4 = stringXOR(stringXOR(w2, "00110000"), nibbleSubstitution(rotateNibble(w3), SBOX));
		String w5 = stringXOR(w4, w3);
		
		key0 = w0 + w1;
		key1 = w2 + w3;
		key2 = w4 + w5;
	}

	private String getKeys() {
		StringBuilder sb = new StringBuilder();
		sb.append("Generated Key0 is : "+key0 + "\n");
		sb.append("Generated Key1 is : "+key1 + "\n");
		sb.append("Generated Key2 is : "+key2 + "\n");
		return sb.toString();
	}


	public static void main(String[] args) {
		String key = null, msg = null;
		Scanner sc = new Scanner(System.in);
		System.out.print("Enter 16-bit Binary key: ");
		key = sc.next();

		System.out.print("Enter 16-bit Cipher Text: ");
		msg = sc.next();

		S_AES simplifiedAdvancedEncryptionStandard = new S_AES(key);
		System.out.println(simplifiedAdvancedEncryptionStandard.getKeys());

		
		sc.close();
	}
}

// Enter 16-bit Binary key: 0100101011110101
// Enter 16-bit Cipher Text: 1101011100101000