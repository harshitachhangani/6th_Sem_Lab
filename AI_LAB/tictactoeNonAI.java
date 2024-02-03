import java.util.Scanner;
import java.util.Random;

public class tictactoeNonAI {
    private static char[][] board = {
            {' ', ' ', ' '},
            {' ', ' ', ' '},
            {' ', ' ', ' '}
    };

    private static char userSymbol = 'X';
    private static char computerSymbol = 'O';

    public static void main(String[] args) {
        displayBoard();
        while (!isGameOver()) {
            userMove();
            displayBoard();

            if (isGameOver()) {
                break;
            }

            computerMove();
            displayBoard();
        }

        announceWinner();
    }

    private static void displayBoard() {
        System.out.println("-------------");
        for (int i = 0; i < 3; i++) {
            System.out.print("| ");
            for (int j = 0; j < 3; j++) {
                System.out.print(board[i][j] + " | ");
            }
            System.out.println("\n-------------");
        }
    }

    private static void userMove() {
        Scanner scanner = new Scanner(System.in);
        int row, col;

        do {
            System.out.print("Enter your move (row [1-3] and column [1-3] separated by space): ");
            row = scanner.nextInt() - 1;
            col = scanner.nextInt() - 1;
        } while (!isValidMove(row, col));

        board[row][col] = userSymbol;
    }

    private static void computerMove() {
        int[] move = findBestMove();
        board[move[0]][move[1]] = computerSymbol;
        System.out.println("Computer played at row " + (move[0] + 1) + " and column " + (move[1] + 1));
    }

    private static boolean isValidMove(int row, int col) {
        if (row < 0 || row >= 3 || col < 0 || col >= 3 || board[row][col] != ' ') {
            System.out.println("Invalid move. Try again.");
            return false;
        }
        return true;
    }

    private static boolean isGameOver() {
        return isWin(userSymbol) || isWin(computerSymbol) || isBoardFull();
    }

    private static boolean isWin(char symbol) {
        for (int i = 0; i < 3; i++) {
            if ((board[i][0] == symbol && board[i][1] == symbol && board[i][2] == symbol) ||
                    (board[0][i] == symbol && board[1][i] == symbol && board[2][i] == symbol)) {
                return true;
            }
        }

        return (board[0][0] == symbol && board[1][1] == symbol && board[2][2] == symbol) ||
                (board[0][2] == symbol && board[1][1] == symbol && board[2][0] == symbol);
    }

    private static boolean isBoardFull() {
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (board[i][j] == ' ') {
                    return false;
                }
            }
        }
        return true;
    }

    private static void announceWinner() {
        if (isWin(userSymbol)) {
            System.out.println("Congratulations! You win!");
        } else if (isWin(computerSymbol)) {
            System.out.println("Sorry, you lose. Better luck next time!");
        } else {
            System.out.println("It's a draw! The game is over.");
        }
    }

    private static int[] findBestMove() {
        int[] move = new int[2];

        // Check if the computer can win
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (board[i][j] == ' ') {
                    board[i][j] = computerSymbol;
                    if (isWin(computerSymbol)) {
                        move[0] = i;
                        move[1] = j;
                        return move;
                    }
                    board[i][j] = ' ';
                }
            }
        }

        // Check if the user can win and block
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (board[i][j] == ' ') {
                    board[i][j] = userSymbol;
                    if (isWin(userSymbol)) {
                        move[0] = i;
                        move[1] = j;
                        return move;
                    }
                    board[i][j] = ' ';
                }
            }
        }

        // Use the magic square method
        int[][] magicSquare = {{8, 1, 6}, {3, 5, 7}, {4, 9, 2}};

        int bestScore = Integer.MIN_VALUE;

        // Check available moves and choose the one with the highest score
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (board[i][j] == ' ') {
                    board[i][j] = computerSymbol;
                    int score = evaluateMove(magicSquare);
                    board[i][j] = ' ';

                    if (score > bestScore) {
                        bestScore = score;
                        move[0] = i;
                        move[1] = j;
                    }
                }
            }
        }

        return move;
    }

    private static int evaluateMove(int[][] magicSquare) {
        int score = 0;

        // Evaluate the move using the magic square method
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (board[i][j] == computerSymbol) {
                    score += magicSquare[i][j];
                } else if (board[i][j] == userSymbol) {
                    score -= magicSquare[i][j];
                }
            }
        }

        return score;
    }
}