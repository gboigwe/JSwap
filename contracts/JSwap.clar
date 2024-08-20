;; title: ShatApp Swap Contract
;; version: 1.0
;; summary: A smart contract for a decentralized cryptocurrency swap application
;; description: This smart contract provides functionality for users to initiate and complete cryptocurrency swaps, as well as cancel pending swaps and update the minimum required governance tokens.
;; traits

;; token definitions
(define-constant GOVERNANCE_TOKEN .governance-token)

;; constants
(define-constant ERR_INSUFFICIENT_BALANCE (err {code: u1, message: "Insufficient STX balance"}))
(define-constant ERR_TRANSFER_FAILED (err {code: u2, message: "STX transfer failed"}))
(define-constant ERR_UNAUTHORIZED (err {code: u3, message: "Unauthorized access"}))
(define-constant ERR_INVALID_SWAP_STATUS (err {code: u4, message: "Invalid swap status"}))
(define-constant ERR_ORACLE_UPDATE_FAILED (err {code: u5, message: "Failed to update oracle data"}))
(define-constant ERR_INVALID_INPUT (err {code: u6, message: "Invalid input parameters"}))

(define-constant MIN_GOVERNANCE_TOKENS u100)
(define-constant MAX_GOVERNANCE_TOKENS u10000)

;; data vars
(define-data-var min-governance-tokens uint u100)
(define-data-var swap-in-progress bool false)
(define-data-var contract-owner principal tx-sender)

;; data maps
(define-map pending-swaps 
   principal 
   { btc-amount: uint, stx-amount: uint, expiry: uint }
)

;; public functions
(define-public (initiate-swap (btc-amount uint))
   (let
       (
           (sender tx-sender)
           (exchange-rate u10000) ;; Mock exchange rate: 1 BTC = 10000 STX
           (stx-amount (* btc-amount exchange-rate))
           (expiry (+ block-height u144)) ;; Set expiry to ~24 hours (assuming 10-minute blocks)
           (user-balance u1000) ;; Mock governance token balance
       )
       (asserts! (not (var-get swap-in-progress)) ERR_INVALID_SWAP_STATUS)
       (asserts! (>= (stx-get-balance sender) stx-amount) ERR_INSUFFICIENT_BALANCE)
       (asserts! (>= user-balance (var-get min-governance-tokens)) ERR_UNAUTHORIZED)
       
       (var-set swap-in-progress true)
       (map-set pending-swaps sender { btc-amount: btc-amount, stx-amount: stx-amount, expiry: expiry })
       
       (ok true)
   )
)

(define-public (complete-swap)
   (let
       (
           (sender tx-sender)
           (swap (unwrap! (map-get? pending-swaps sender) ERR_INVALID_SWAP_STATUS))
       )
       (asserts! (var-get swap-in-progress) ERR_INVALID_SWAP_STATUS)
       (asserts! (<= block-height (get expiry swap)) ERR_INVALID_SWAP_STATUS)
       
       (var-set swap-in-progress false)
       (map-delete pending-swaps sender)
       
       (match (stx-transfer? (get stx-amount swap) (as-contract tx-sender) sender)
           success (ok (get stx-amount swap))
           error ERR_TRANSFER_FAILED
       )
   )
)

(define-public (cancel-swap)
   (let
       (
           (sender tx-sender)
       )
       (asserts! (is-some (map-get? pending-swaps sender)) ERR_INVALID_SWAP_STATUS)
       
       (var-set swap-in-progress false)
       (map-delete pending-swaps sender)
       
       (ok true)
   )
)

(define-public (update-min-governance-tokens (new-min uint))
   (begin
       (asserts! (is-eq tx-sender (var-get contract-owner)) ERR_UNAUTHORIZED)
       (asserts! (and (>= new-min MIN_GOVERNANCE_TOKENS) 
                      (<= new-min MAX_GOVERNANCE_TOKENS)) 
                 ERR_INVALID_INPUT)
       (ok (var-set min-governance-tokens new-min))
   )
)

;; read only functions
(define-read-only (get-min-governance-tokens)
   (ok (var-get min-governance-tokens))
)

(define-read-only (get-contract-owner)
   (ok (var-get contract-owner))
)

;; private functions