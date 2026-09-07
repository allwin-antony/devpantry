export type TokenStatus = 'valid' | 'expired' | 'premature' | 'alg_none' | 'malformed';

export interface JwtHeader {
  alg: string;
  typ?: string;
  kid?: string;
  [key: string]: unknown;
}

export interface JwtPayload {
  iss?: string;
  sub?: string;
  aud?: string | string[];
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  [key: string]: unknown;
}

export interface ClaimDiagnostic {
  key: string;
  value: unknown;
  label: string;
  description: string;
  isStandard: boolean;
  status?: 'normal' | 'expired' | 'future' | 'warning' | 'chaos';
  formattedTime?: string;
  relativeTime?: string;
}

export interface ParsedJwt {
  raw: string;
  headerB64: string;
  payloadB64: string;
  signatureB64: string;
  header: JwtHeader;
  payload: JwtPayload;
  status: TokenStatus;
  statusMessage: string;
  diagnostics: ClaimDiagnostic[];
  secondsRemaining: number | null;
  totalDuration: number | null;
  percentRemaining: number | null;
  hasSignature: boolean;
  isValidStructure: boolean;
  error?: string;
}

export type ChaosMutationType =
  | 'expire_now'
  | 'expire_soon'
  | 'clock_skew_future'
  | 'clock_skew_past'
  | 'alg_none'
  | 'corrupt_signature'
  | 'strip_sub'
  | 'strip_exp'
  | 'strip_roles'
  | 'strip_aud'
  | 'inject_blns_name'
  | 'inject_blns_roles'
  | 'inject_zalgo'
  | 'swap_to_hs256';

export interface JwtPreset {
  id: string;
  name: string;
  provider: string;
  description: string;
  token: string;
  sampleSecret?: string;
}
