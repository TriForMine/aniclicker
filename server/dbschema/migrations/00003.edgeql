CREATE MIGRATION m1mvbfne7vzeursfkgrjm42wpthqtz4ihkk6iimmsjlorw6iwjw66a
    ONTO m1esns7r2iipizkem6hmbs2he3wwzqe2bx45puqoilzd3zggvsxzhq
{
  ALTER TYPE default::RefreshToken {
      ALTER PROPERTY jti {
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
