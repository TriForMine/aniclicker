CREATE MIGRATION m1esns7r2iipizkem6hmbs2he3wwzqe2bx45puqoilzd3zggvsxzhq
    ONTO m13tjv2ncud7ttkmlydvbitxkehfgx5zqnjogzhrpdxmw6vmrfomyq
{
  ALTER TYPE default::RefreshToken {
      CREATE REQUIRED PROPERTY jti -> std::uuid {
          SET REQUIRED USING (std::uuid_generate_v1mc());
      };
  };
};
