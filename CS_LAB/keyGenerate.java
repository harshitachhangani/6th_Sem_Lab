public class keyGenerate {

    int key[] = {1, 0, 1, 0, 0, 0, 0, 0, 1, 0}; // Example key

    int P10[] = {3, 5, 2, 7, 4, 10, 1, 9, 8, 6};
    int P8[] = {6, 3, 7, 4, 8, 5, 10, 9};

    int key1[] = new int[8];
    int key2[] = new int[8];



    
    public void keyGeneration() {

        System.out.println("Given Plain Text :");

        // Example plaintext
        int[] plaintext = {1, 0, 0, 1, 0, 1, 1, 1};
        for (int i = 0; i < 8; i++)
            System.out.print(plaintext[i] + " ");
        int key_[] = new int[10];

        for (int i = 0; i < 10; i++) {
            key_[i] = key[P10[i] - 1];
        }

        int Ls[] = new int[5];
        int Rs[] = new int[5];

        for (int i = 0; i < 5; i++) {
            Ls[i] = key_[i];
            Rs[i] = key_[i + 5];
        }

        int[] Ls_1 = shift(Ls, 1);
        int[] Rs_1 = shift(Rs, 1);

        for (int i = 0; i < 5; i++) {
            key_[i] = Ls_1[i];
            key_[i + 5] = Rs_1[i];
        }

        for (int i = 0; i < 8; i++) {
            key1[i] = key_[P8[i] - 1];
        }

        int[] Ls_2 = shift(Ls, 2);
        int[] Rs_2 = shift(Rs, 2);

        for (int i = 0; i < 5; i++) {
            key_[i] = Ls_2[i];
            key_[i + 5] = Rs_2[i];
        }

        for (int i = 0; i < 8; i++) {
            key2[i] = key_[P8[i] - 1];
        }

        System.out.println("\nGenerated Key-1 :");

        for (int i = 0; i < 8; i++)
            System.out.print(key1[i] + " ");

        System.out.println();
        System.out.println("Generated Key-2 :");

        for (int i = 0; i < 8; i++)
            System.out.print(key2[i] + " ");
      
    }

    int[] shift(int[] ar, int n) {
        while (n > 0) {
            int temp = ar[0];
            for (int i = 0; i < ar.length - 1; i++) {
                ar[i] = ar[i + 1];
            }
            ar[ar.length - 1] = temp;
            n--;
        }
        return ar;
    }

    public static void main(String[] args) {
        keyGenerate obj = new keyGenerate();
        obj.keyGeneration();
    }
}
