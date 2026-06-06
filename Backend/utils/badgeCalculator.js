const calculateBadges = (
  progress,
  streak,
  goalReached
) => {
  const badges = [];

  if (progress.length >= 1) {
    badges.push(
      "🏅 First Weight Entry"
    );
  }

  if (progress.length >= 10) {
    badges.push(
      "📈 Progress Master"
    );
  }

  if (streak >= 7) {
    badges.push(
      "🔥 7 Day Streak"
    );
  }

  if (streak >= 30) {
    badges.push(
      "👑 Fitness Champion"
    );
  }

  if (goalReached) {
    badges.push(
      "🎯 Goal Achieved"
    );
  }

  return badges;
};

module.exports =
  calculateBadges;