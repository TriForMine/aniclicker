CREATE MIGRATION m13tjv2ncud7ttkmlydvbitxkehfgx5zqnjogzhrpdxmw6vmrfomyq
    ONTO initial
{
  CREATE TYPE default::RefreshToken {
      CREATE REQUIRED PROPERTY createdAt -> std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE REQUIRED PROPERTY hashedToken -> std::str;
      CREATE REQUIRED PROPERTY revoked -> std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY updatedAt -> std::datetime {
          SET default := (std::datetime_current());
      };
  };
  CREATE TYPE default::User {
      CREATE MULTI LINK refreshTokens -> default::RefreshToken {
          ON TARGET DELETE  DELETE SOURCE;
      };
      CREATE REQUIRED PROPERTY createdAt -> std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE REQUIRED PROPERTY email -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY password -> std::str;
      CREATE REQUIRED PROPERTY updatedAt -> std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE REQUIRED PROPERTY username -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  ALTER TYPE default::RefreshToken {
      CREATE LINK user -> default::User;
  };
};
