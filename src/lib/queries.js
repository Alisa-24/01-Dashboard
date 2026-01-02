export const XP_OVER_TIME_QUERY = `
  query XpOverTime($since: timestamptz!) {
    transaction(
      where: { type: { _eq: "xp" }, createdAt: { _gte: $since } }
      order_by: { createdAt: asc }
    ) {
      amount
      createdAt
    }
  }
`;
