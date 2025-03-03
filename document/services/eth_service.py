import os
import json
from web3 import Web3
from django.conf import settings

class BlockchainService:
    def __init__(self):
        # Load Web3 connection
        self.web3 = Web3(Web3.HTTPProvider(settings.RPC_URL))


        # Load Contract ABI & Address
        contract_abi_path = os.path.join(os.path.dirname(__file__), "contract_abi", "DocumentRegistry.json")
        
        if not os.path.exists(contract_abi_path):
            raise FileNotFoundError(f"Contract ABI file not found at: {contract_abi_path}")

        with open(contract_abi_path) as f:
            contract_data = json.load(f)

        self.contract_address = contract_data["contractAddress"]  # Get contract address from JSON
        contract_abi = contract_data["abi"]  # Get ABI from JSON

        self.account = self.web3.eth.account.from_key(settings.PRIVATE_KEY)
        self.contract = self.web3.eth.contract(address=self.contract_address, abi=contract_abi)

    def store_document(self, document_id, document_hash):
        """
        Stores the document hash and document ID on the blockchain.
        """
        try:
            print(f"🔵 Storing on Blockchain: Document ID: {document_id}, Hash: {document_hash}")

            tx = self.contract.functions.storeDocument(document_id, document_hash).build_transaction({
                'from': self.account.address,
                'nonce': self.web3.eth.get_transaction_count(self.account.address),
                'gas': 2000000,
                'gasPrice': self.web3.to_wei('50', 'gwei')
            })

            signed_tx = self.web3.eth.account.sign_transaction(tx, private_key=self.account.key)
            tx_hash = self.web3.eth.send_raw_transaction(signed_tx.raw_transaction)

            print(f"✅ Transaction Sent: {self.web3.to_hex(tx_hash)}")
            return self.web3.to_hex(tx_hash)

        except Exception as e:
            print(f"❌ Blockchain storage failed: {str(e)}")
            raise



    def verify_document(self, document_id, document_hash):
        """
        Retrieves the document hash from the blockchain and verifies it.
        """
        try:
            stored_hash = self.contract.functions.getDocumentHash(document_id).call()  # ✅ NEW
            print(f"Stored Hash on Blockchain: {stored_hash}")  # Debugging
            print(f"Expected Hash (MongoDB): {document_hash}")  # Debugging
            return stored_hash == document_hash
        except Exception as e:
            print(f"Blockchain verification failed: {str(e)}")
            return False



# import os
# import json
# import logging
# from web3 import Web3
# from django.conf import settings

# logger = logging.getLogger(__name__)

# class BlockchainService:
#     def __init__(self):
#         # Initialize Web3 connection
#         self.web3 = Web3(Web3.HTTPProvider(settings.RPC_URL))
        
#         if not self.web3.is_connected():
#             logger.error("❌ Web3 is not connected. Check your RPC_URL.")
#             raise ConnectionError("Web3 is not connected. Check your RPC_URL.")

#         # Load Contract ABI & Address
#         contract_abi_path = os.path.join(os.path.dirname(__file__), "contract_abi", "DocumentRegistry.json")
        
#         if not os.path.exists(contract_abi_path):
#             logger.error(f"❌ Contract ABI file not found at: {contract_abi_path}")
#             raise FileNotFoundError(f"Contract ABI file not found at: {contract_abi_path}")

#         with open(contract_abi_path) as f:
#             contract_data = json.load(f)

#         self.contract_address = self.web3.to_checksum_address(contract_data["contractAddress"])  # Ensure checksum
#         contract_abi = contract_data["abi"]

#         # Initialize account
#         try:
#             self.account = self.web3.eth.account.from_key(settings.PRIVATE_KEY)
#         except Exception as e:
#             logger.error(f"❌ Invalid Private Key: {str(e)}")
#             raise ValueError("Invalid Private Key provided.")

#         # Initialize contract
#         try:
#             self.contract = self.web3.eth.contract(address=self.contract_address, abi=contract_abi)
#         except Exception as e:
#             logger.error(f"❌ Failed to initialize contract: {str(e)}")
#             raise

#         # Print connected account and balance
#         self.get_balance()

#     def get_balance(self):
#         try:
#             balance_wei = self.web3.eth.get_balance(self.account.address)
#             balance_eth = self.web3.from_wei(balance_wei, 'ether')
#             print(f"🔵 Balance of {self.account.address}: {balance_eth} ETH")
#             return balance_eth
#         except Exception as e:
#             logger.error(f"❌ Failed to fetch balance: {str(e)}")
#             return 0

#     def store_document(self, document_id, document_hash):
#         """
#         Stores the document hash and document ID on the blockchain.
#         """
#         try:
#             logger.info(f"🔵 Storing on Blockchain: Document ID: {document_id}, Hash: {document_hash}")

#             # Check account balance
#             balance = self.get_balance()
#             if balance < 0.001:  # Example threshold
#                 logger.error("❌ Insufficient funds to perform the transaction.")
#                 raise ValueError("Insufficient funds to perform the transaction.")

#             # Get current gas price
#             gas_price = self.web3.eth.gas_price
#             logger.debug(f"🔵 Current Gas Price: {self.web3.from_wei(gas_price, 'gwei')} Gwei")

#             # Estimate gas
#             estimated_gas = self.contract.functions.storeDocument(document_id, document_hash).estimate_gas({
#                 'from': self.account.address
#             })
#             logger.debug(f"🔵 Estimated Gas: {estimated_gas}")

#             # Build transaction
#             txn = self.contract.functions.storeDocument(document_id, document_hash).build_transaction({
#                 'from': self.account.address,
#                 'nonce': self.web3.eth.get_transaction_count(self.account.address),
#                 'gas': estimated_gas,
#                 'gasPrice': gas_price,
#                 'value': self.web3.toWei('0', 'ether')  # Ensure no ETH is sent
#             })

#             # Sign transaction
#             signed_txn = self.web3.eth.account.sign_transaction(txn, private_key=self.account.key)

#             # Send transaction
#             tx_hash = self.web3.eth.send_raw_transaction(signed_txn.rawTransaction)
#             tx_hash_hex = self.web3.toHex(tx_hash)
#             logger.info(f"✅ Transaction Sent: {tx_hash_hex}")

#             # Wait for transaction receipt
#             receipt = self.web3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
#             if receipt.status == 1:
#                 logger.info(f"✅ Transaction Mined Successfully: {tx_hash_hex}")
#             else:
#                 logger.error(f"❌ Transaction Failed: {tx_hash_hex}")
#                 raise Exception("Transaction failed on the blockchain.")

#             return tx_hash_hex

#         except ValueError as ve:
#             logger.error(f"❌ Blockchain storage failed: {str(ve)}")
#             raise ve
#         except Exception as e:
#             logger.error(f"❌ Blockchain storage failed: {str(e)}")
#             raise e

#     def verify_document(self, document_id, document_hash):
#         """
#         Retrieves the document hash from the blockchain and verifies it.
#         """
#         try:
#             stored_hash = self.contract.functions.getDocumentHash(document_id).call()
#             logger.debug(f"Stored Hash on Blockchain: {stored_hash}")
#             logger.debug(f"Expected Hash (MongoDB): {document_hash}")
#             is_valid = stored_hash == document_hash
#             logger.info(f"📄 Document Verification: {'Valid' if is_valid else 'Invalid'}")
#             return is_valid
#         except Exception as e:
#             logger.error(f"❌ Blockchain verification failed: {str(e)}")
#             return False
