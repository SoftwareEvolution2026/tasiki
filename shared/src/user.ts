/** A user as exposed to clients — never includes the password hash. */
export interface PublicUser {
  id: string;
  email: string;
  createdAt: string;
}
