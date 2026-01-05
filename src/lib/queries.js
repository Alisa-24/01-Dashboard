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

export const XP_BY_PROJECT_QUERY = `
  query XpByProject {
    transaction(
      where: { 
        type: { _eq: "xp" }
        object: { type: { _eq: "project" } }
      }
    ) {
      amount
      createdAt
      object {
        name
        type
      }
    }
  }
`;

export const AUDIT_RATIO_QUERY = `
  query AuditRatio {
    user {
      auditRatio
      totalUp
      totalDown
    }
  }
`;

export const PROJECT_PASS_FAIL_QUERY = `
  query ProjectPassFail {
    result(
      where: {
        object: { type: { _eq: "project" } }
      }
    ) {
      grade
      objectId
      object {
        name
      }
    }
  }
`;

export const PISCINE_STATS_QUERY = `
  query PiscineStats($piscinePath: String!) {
    progress(
      where: {
        path: { _ilike: $piscinePath }
        object: { type: { _eq: "exercise" } }
      }
      order_by: { createdAt: asc }
    ) {
      grade
      createdAt
      path
      object {
        name
        type
      }
    }
  }
`;

export const AUDIT_HISTORY_QUERY = `
  query AuditHistory {
    transaction(
      where: { type: { _in: ["up", "down"] } }
      order_by: { createdAt: desc }
    ) {
      type
      amount
      path
      createdAt
      object {
        name
      }
    }
  }
`;
