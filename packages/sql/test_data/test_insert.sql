INSERT INTO Account(AccountID, Email, Username, Password)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'demo@demo.com',
  'demo',
  '12345password'
)
ON CONFLICT DO NOTHING;