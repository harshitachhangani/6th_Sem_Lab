import java.util.*;

public class tictactoeAI {
    
    private static final int BOARD_SIZE = 3;
    private static final char EMPTY_CELL = ' ';
    private static final char HUMAN_PLAYER = 'X';
    private static final char AI_PLAYER = 'O';

    private static char[][] board = new char[BOARD_SIZE][BOARD_SIZE];

    public static void main(String[] args) {

        // Initialize the game board with empty cells.
        initializeBoard();

        Scanner scanner = new Scanner(System.in);

        System.out.println("Tic Tac Toe - Human vs. Computer");
        System.out.println("You are X, and the Computer is O.");

        printNumberedBoard();  // Display the numbered board to help players choose their moves.

        // The game loop, where the human and AI players take turns until the game is over.
        while (!isGameOver()) {
            humanTurn(scanner);   // Human player's turn.

            if (isGameOver()) {

                break;   // If the game is over after the human turn, break the loop.
            }

            aiTurn();    // AI player's turn.
            printNumberedBoard();
        }

        scanner.close();

        // Determine the winner and display the result.

        char winner = checkWinner();
        if (winner == HUMAN_PLAYER) {
            System.out.println("Congra*///tulations! You win!");
        } else if (winner == AI_PLAYER) {
            System.out.println("Computer wins! Better luck next time.");
        } else {
            System.out.println("It's a draw! Well played!");
        }
    }

    private static void initializeBoard() {

        // Fill the game board with empty cells (spaces).

        for (int i = 0; i < BOARD_SIZE; i++) {
            for (int j = 0; j < BOARD_SIZE; j++) {
                board[i][j] = EMPTY_CELL;
            }
        }
    }

    private static void printNumberedBoard() {

        // Display the game board with cell numbers for reference.

        System.out.println("-------------");
        int cellNumber = 1;
        for (int i = 0; i < BOARD_SIZE; i++) 
        {
            System.out.print("| ");
            for (int j = 0; j < BOARD_SIZE; j++) 
            {
                if (board[i][j] == EMPTY_CELL) 
                {
                    System.out.print(cellNumber);
                } else
                 {
                    System.out.print(board[i][j]);
                 }
                System.out.print(" | ");
                cellNumber++;
            }
            System.out.println();
            System.out.println("-------------");
        }
    }

    private static void humanTurn(Scanner scanner) {

        // Prompt the human player for their move.

        System.out.println("Your turn. Enter a cell number (1-9):");
        int cellNumber = scanner.nextInt();

        // Validate the move and place the human player's mark on the board if it's a valid move.

        if (isValidMove(cellNumber) && board[getRow(cellNumber)][getCol(cellNumber)] == EMPTY_CELL) {
            board[getRow(cellNumber)][getCol(cellNumber)] = HUMAN_PLAYER;
        } else {
            System.out.println("Invalid move. Try again.");
            humanTurn(scanner);   // Recursively ask for input until a valid move is made.
        }
    }

    private static boolean isValidMove(int cellNumber) {

        // Check if the cell number is within the valid range (1 to 9).

        return cellNumber >= 1 && cellNumber <= 9;
    }

    private static int getRow(int cellNumber) {

        // Map the cell number to the corresponding row index in the board array.

        switch (cellNumber) {
            case 1:
            case 2:
            case 3:
                return 0;
            case 4:
            case 5:
            case 6:
                return 1;
            case 7:
            case 8:
            case 9:
                return 2;
        }

        return 0;
    }

    private static int getCol(int cellNumber) {

        // Map the cell number to the corresponding column index in the board array.

        switch (cellNumber) {
            case 1:
            case 4:
            case 7:
                return 0;
            case 2:
            case 5:
            case 8:
                return 1;
            case 3:
            case 6:
            case 9:
                return 2;
        }

        return 0;
    }

    private static void aiTurn() {

        // The AI player's turn.

        int[] bestMove = findBestMove();   // Find the best move for the AI.
        board[bestMove[0]][bestMove[1]] = AI_PLAYER;   // Place the AI's mark ('O') on the board.
    }

    // Find the best move for the AI using the minimax algorithm.

    private static int[] findBestMove() {

        int bestScore = Integer.MIN_VALUE;    //-2147483648

        // Initialize with invalid move coordinates.
        int[] bestMove = new int[]{-1, -1};

        for (int i = 0; i < BOARD_SIZE; i++) {
            for (int j = 0; j < BOARD_SIZE; j++) {

                // If the cell is empty, try placing the AI's mark and evaluate the score.

                if (board[i][j] == EMPTY_CELL) {

                    board[i][j] = AI_PLAYER;

                    // Call the minimax algorithm for the human player's turn.
                    int score = minimax(board, false);

                    board[i][j] = EMPTY_CELL;  // Undo the move

                    // If the evaluated score is better than the current best, update the best move.
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove[0] = i;
                        bestMove[1] = j;
                    }
                }
            }
        }

        return bestMove;
    }

  // The minimax algorithm to find the best move for both AI and human players.
    private static int minimax(char[][] board, boolean isMaximizingPlayer) {
        
        if (isGameOver()) {
            return evaluateBoard();
        }

        // If it's the AI player's turn, maximize the score.
        if (isMaximizingPlayer) {
            int bestScore = Integer.MIN_VALUE;
            for (int i = 0; i < BOARD_SIZE; i++) {
                for (int j = 0; j < BOARD_SIZE; j++) {

                    // If the cell is empty, try placing the AI's mark and call minimax for the human player's turn.
                    if (board[i][j] == EMPTY_CELL) {
                        board[i][j] = AI_PLAYER;
                        bestScore = Math.max(bestScore, minimax(board, false)); // human
                        board[i][j] = EMPTY_CELL;   // Undo the move.
                    }
                }
            }
            return bestScore;
        } else {
            
            // If it's the human player's turn, minimize the score.
            int bestScore = Integer.MAX_VALUE;
            for (int i = 0; i < BOARD_SIZE; i++) {
                for (int j = 0; j < BOARD_SIZE; j++) {

                    // If the cell is empty, try placing the human's mark and call minimax for the AI player's turn.

                    if (board[i][j] == EMPTY_CELL) {
                        board[i][j] = HUMAN_PLAYER;
                        bestScore = Math.min(bestScore, minimax(board, true)); // AI
                        board[i][j] = EMPTY_CELL;  // Undo the move.
                    }
                }
            }
            return bestScore;
        }
    }

    // Check if the game is over (either a player wins or the board is full).
    private static boolean isGameOver() {
        return isBoardFull() || checkWinner() != EMPTY_CELL;
    }

    // Check if the board is full (no empty cells).
    private static boolean isBoardFull() {

        for (int i = 0; i < BOARD_SIZE; i++) {
            for (int j = 0; j < BOARD_SIZE; j++) {
                if (board[i][j] == EMPTY_CELL) {

                    // If an empty cell is found, the board is not full yet.
                    return false;
                }
            }
        }
        return true;   // If no empty cells are found, the board is full.
    }

    // If no empty cells are found, the board is full.
    private static char checkWinner() {

        for (int i = 0; i < BOARD_SIZE; i++) {
            if (board[i][0] == board[i][1] && board[i][1] == board[i][2] && board[i][0] != EMPTY_CELL) {
                return board[i][0];  // Row win.
            }
            if (board[0][i] == board[1][i] && board[1][i] == board[2][i] && board[0][i] != EMPTY_CELL) {
                return board[0][i];  // Column win.

            }
        }
        if (board[0][0] == board[1][1] && board[1][1] == board[2][2] && board[0][0] != EMPTY_CELL) {
            return board[0][0];  // Diagonal win (top-left to bottom-right).
        }
        if (board[0][2] == board[1][1] && board[1][1] == board[2][0] && board[0][2] != EMPTY_CELL) {
            return board[0][2];  // Diagonal win (top-right to bottom-left).
        
        }
        // If no winner is found, return EMPTY_CELL to represent a draw.
        return EMPTY_CELL;
    }

            // Evaluate the board to assign scores for the AI player's strategy.

    private static int evaluateBoard() {
        char winner = checkWinner();

        // AI wins (positive score).
        if (winner == AI_PLAYER) {
            return 10;
        } else if (winner == HUMAN_PLAYER) {      // Human wins (negative score).
            return -10;
        } else {
            return 0;               // Draw (score of 0).
        }
    }
}