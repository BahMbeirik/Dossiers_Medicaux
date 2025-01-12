import os

# Générer une clé AES de 32 octets (256 bits)
aes_key = os.urandom(16)

# Afficher la clé sous forme de chaîne hexadécimale
print(aes_key.hex())