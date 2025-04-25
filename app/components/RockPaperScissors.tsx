"use client";

import { useState } from "react";
import { useNotification } from "@coinbase/onchainkit/minikit";
import { Button, Card, Icon } from "./DemoComponents";

// Define the possible choices
type Choice = "rock" | "paper" | "scissors" | null;
type GameState = "welcome" | "playing" | "roundResult" | "gameOver";

// Define the result of a round
type RoundResult = "win" | "lose" | "draw" | null;

export function RockPaperScissors() {
  // Game state
  const [gameState, setGameState] = useState<GameState>("welcome");
  const [playerChoice, setPlayerChoice] = useState<Choice>(null);
  const [computerChoice, setComputerChoice] = useState<Choice>(null);
  const [roundResult, setRoundResult] = useState<RoundResult>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [gameWinner, setGameWinner] = useState<"player" | "computer" | "draw" | null>(null);
  
  // For notifications
  const sendNotification = useNotification();

  // Determine the winner of a round
  const determineWinner = (player: Choice, computer: Choice): RoundResult => {
    if (!player || !computer) return null;
    
    if (player === computer) return "draw";
    
    if (
      (player === "rock" && computer === "scissors") ||
      (player === "paper" && computer === "rock") ||
      (player === "scissors" && computer === "paper")
    ) {
      return "win";
    }
    
    return "lose";
  };

  // Get a random choice for the computer
  const getComputerChoice = (): Choice => {
    const choices: Choice[] = ["rock", "paper", "scissors"];
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
  };

  // Handle player choice
  const handlePlayerChoice = (choice: Choice) => {
    if (!choice) return;
    
    setPlayerChoice(choice);
    const computer = getComputerChoice();
    setComputerChoice(computer);
    
    const result = determineWinner(choice, computer);
    setRoundResult(result);
    
    // Update scores
    if (result === "win") {
      setPlayerScore(prev => prev + 1);
    } else if (result === "lose") {
      setComputerScore(prev => prev + 1);
    }
    
    setGameState("roundResult");
  };

  // Start a new round
  const startNextRound = () => {
    if (currentRound >= 5) {
      // Game over after 5 rounds
      let winner: "player" | "computer" | "draw" | null = null;
      
      if (playerScore > computerScore) {
        winner = "player";
      } else if (computerScore > playerScore) {
        winner = "computer";
      } else {
        winner = "draw";
      }
      
      setGameWinner(winner);
      setGameState("gameOver");
    } else {
      // Next round
      setCurrentRound(prev => prev + 1);
      setPlayerChoice(null);
      setComputerChoice(null);
      setRoundResult(null);
      setGameState("playing");
    }
  };

  // Reset the game
  const resetGame = () => {
    setPlayerScore(0);
    setComputerScore(0);
    setCurrentRound(1);
    setPlayerChoice(null);
    setComputerChoice(null);
    setRoundResult(null);
    setGameWinner(null);
    setGameState("welcome");
  };

  // Share the win
  const shareWin = async () => {
    if (gameWinner === "player") {
      await sendNotification({
        title: "Rock Paper Scissors Victory!",
        body: `I won ${playerScore}-${computerScore} in Rock Paper Scissors!`,
      });
    }
  };

  // Get the emoji for a choice
  const getChoiceEmoji = (choice: Choice): string => {
    switch (choice) {
      case "rock": return "👊";
      case "paper": return "✋";
      case "scissors": return "✌️";
      default: return "";
    }
  };

  // Get the result text
  const getResultText = (): string => {
    switch (roundResult) {
      case "win": return "You win this round!";
      case "lose": return "Computer wins this round!";
      case "draw": return "It's a draw!";
      default: return "";
    }
  };

  // Render the welcome screen
  const renderWelcome = () => (
    <Card title="Rock Paper Scissors">
      <div className="text-center space-y-6">
        <div className="text-4xl mb-4">👊 ✋ ✌️</div>
        <p className="text-[var(--app-foreground-muted)] mb-4">
          Play 5 rounds of Rock Paper Scissors against the computer. 
          Best score wins!
        </p>
        <Button 
          onClick={() => setGameState("playing")}
          icon={<Icon name="arrow-right" size="sm" />}
        >
          Start Game
        </Button>
      </div>
    </Card>
  );

  // Render the game screen
  const renderGame = () => (
    <Card title={`Round ${currentRound} of 5`}>
      <div className="text-center space-y-6">
        <div className="flex justify-between mb-4">
          <div className="text-[var(--app-foreground-muted)]">
            You: {playerScore}
          </div>
          <div className="text-[var(--app-foreground-muted)]">
            Computer: {computerScore}
          </div>
        </div>
        
        <p className="text-[var(--app-foreground-muted)] mb-4">
          Make your choice:
        </p>
        
        <div className="flex justify-center space-x-4">
          <Button 
            onClick={() => handlePlayerChoice("rock")}
            className="text-2xl px-6 py-4"
          >
            👊
          </Button>
          <Button 
            onClick={() => handlePlayerChoice("paper")}
            className="text-2xl px-6 py-4"
          >
            ✋
          </Button>
          <Button 
            onClick={() => handlePlayerChoice("scissors")}
            className="text-2xl px-6 py-4"
          >
            ✌️
          </Button>
        </div>
      </div>
    </Card>
  );

  // Render the round result screen
  const renderRoundResult = () => (
    <Card title={`Round ${currentRound} Result`}>
      <div className="text-center space-y-6">
        <div className="flex justify-between mb-4">
          <div className="text-[var(--app-foreground-muted)]">
            You: {playerScore}
          </div>
          <div className="text-[var(--app-foreground-muted)]">
            Computer: {computerScore}
          </div>
        </div>
        
        <div className="flex justify-center items-center space-x-8">
          <div className="text-center">
            <div className="text-4xl mb-2">{getChoiceEmoji(playerChoice)}</div>
            <div className="text-[var(--app-foreground-muted)]">You</div>
          </div>
          <div className="text-xl">vs</div>
          <div className="text-center">
            <div className="text-4xl mb-2">{getChoiceEmoji(computerChoice)}</div>
            <div className="text-[var(--app-foreground-muted)]">Computer</div>
          </div>
        </div>
        
        <div className="text-xl font-bold">{getResultText()}</div>
        
        <Button onClick={startNextRound}>
          {currentRound >= 5 ? "See Final Result" : "Next Round"}
        </Button>
      </div>
    </Card>
  );

  // Render the game over screen
  const renderGameOver = () => (
    <Card title="Game Over">
      <div className="text-center space-y-6">
        <div className="text-2xl font-bold mb-4">
          {gameWinner === "player" 
            ? "🎉 You Win! 🎉" 
            : gameWinner === "computer" 
              ? "Computer Wins!" 
              : "It's a Draw!"}
        </div>
        
        <div className="text-xl mb-4">
          Final Score: {playerScore} - {computerScore}
        </div>
        
        <div className="flex flex-col space-y-4">
          {gameWinner === "player" && (
            <Button 
              onClick={shareWin}
              variant="primary"
              icon={<Icon name="star" size="sm" />}
            >
              Cast Your Win
            </Button>
          )}
          
          <Button 
            onClick={resetGame}
            variant="secondary"
          >
            Play Again
          </Button>
        </div>
      </div>
    </Card>
  );

  // Render the appropriate screen based on game state
  const renderGameState = () => {
    switch (gameState) {
      case "welcome": return renderWelcome();
      case "playing": return renderGame();
      case "roundResult": return renderRoundResult();
      case "gameOver": return renderGameOver();
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {renderGameState()}
    </div>
  );
}
