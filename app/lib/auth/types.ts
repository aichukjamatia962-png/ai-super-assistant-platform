export type AuthUser = {
      id: string;
        email: string;
          name: string | null;
          };

          export type AuthSession = {
            id: string;
              userId: string;
                expiresAt: Date;
                };