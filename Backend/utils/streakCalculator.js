function calculateCurrentStreak(progress) {
  if (!progress.length) return 0;

  const sorted = [...progress].sort(
    (a, b) =>
      new Date(a.createdAt) -
      new Date(b.createdAt)
  );

  let streak = 1;

  for (
    let i = sorted.length - 1;
    i > 0;
    i--
  ) {
    const currentDate = new Date(
      sorted[i].createdAt
    );

    const previousDate = new Date(
      sorted[i - 1].createdAt
    );

    const difference =
      Math.floor(
        (currentDate - previousDate) /
          (1000 * 60 * 60 * 24)
      );

    if (difference <= 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function calculateLongestStreak(progress) {
  if (!progress.length) return 0;

  const sorted = [...progress].sort(
    (a, b) =>
      new Date(a.createdAt) -
      new Date(b.createdAt)
  );

  let current = 1;
  let longest = 1;

  for (
    let i = 1;
    i < sorted.length;
    i++
  ) {
    const currentDate = new Date(
      sorted[i].createdAt
    );

    const previousDate = new Date(
      sorted[i - 1].createdAt
    );

    const difference =
      Math.floor(
        (currentDate - previousDate) /
          (1000 * 60 * 60 * 24)
      );

    if (difference <= 1) {
      current++;
      longest = Math.max(
        longest,
        current
      );
    } else {
      current = 1;
    }
  }

  return longest;
}

module.exports = {
  calculateCurrentStreak,
  calculateLongestStreak,
};