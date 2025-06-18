def subset_sum(expenses, budget):
    n = len(expenses)
    dp = [[False] * (budget + 1) for _ in range(n + 1)]
    dp[0][0] = True

    # Fill the DP table
    for i in range(1, n + 1):
        for j in range(budget + 1):
            if j < expenses[i - 1]['cost']:
                dp[i][j] = dp[i - 1][j]
            else:
                dp[i][j] = dp[i - 1][j] or dp[i - 1][j - expenses[i - 1]['cost']]

    # Backtrack to find the selected expenses
    for j in range(budget, -1, -1):
        if dp[n][j]:
            result = []
            w = j
            for i in range(n, 0, -1):
                if not dp[i - 1][w]:
                    result.append(expenses[i - 1])
                    w -= expenses[i - 1]['cost']
            return result[::-1]  # Return in original order
    return []
