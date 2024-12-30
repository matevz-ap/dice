export function roll(dice) {
    return dice[Math.floor(Math.random() * dice.length)];
}