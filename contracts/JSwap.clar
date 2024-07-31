;; Error codes
;; (define-constant ERR_INSUFFICIENT_BALANCE (err u1 "Insufficient STX balance"))
(define-constant ERR_INSUFFICIENT_BALANCE (err {code: u1, message: "Insufficient STX balance"}))
;; (define-constant ERR_TRANSFER_FAILED (err u2 "STX transfer failed"))
(define-constant ERR_TRANSFER_FAILED (err {code: u2, message: "STX transfer failed"}))
;; (define-constant ERR_UNAUTHORIZED (err u3 "Unauthorized access"))
(define-constant ERR_UNAUTHORIZED (err {code: u3, message: "Unauthorized access"}))
;; (define-constant ERR_INVALID_SWAP_STATUS (err u4 "Invalid swap status"))
(define-constant ERR_INVALID_SWAP_STATUS (err {code: u4, message: "Invalid swap status"}))
;; (define-constant ERR_ORACLE_UPDATE_FAILED (err u5 "Failed to update oracle data"))
(define-constant ERR_ORACLE_UPDATE_FAILED (err {code: u5, message: "Failed to update oracle data"}))
;; (define-constant ERR_INVALID_INPUT (err u6 "Invalid input parameters"))
(define-constant ERR_INVALID_INPUT (err {code: u6, message: "Invalid input parameters"}))

;; Governance token
(define-constant GOVERNANCE_TOKEN .governance-token)

;; Minimum governance tokens required to swap
(define-data-var min-governance-tokens uint u100)

;; Constants for governance token limits
(define-constant MIN_GOVERNANCE_TOKENS u100)
(define-constant MAX_GOVERNANCE_TOKENS u10000)

;; Swap status
(define-data-var swap-in-progress bool false)

;; Swap details
(define-map pending-swaps 
    principal 
    { btc-amount: uint, stx-amount: uint, expiry: uint }
)

;; Function to initiate a swap
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

;; Function to complete the swap (to be called after BTC transfer is confirmed)
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
            error ERR_TRANSFER_FAILED  ;; Use the predefined error constant
        )
    )
)

;; Function to cancel a pending swap
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

;; Function to update the minimum required governance tokens
(define-public (update-min-governance-tokens (new-min uint))
    (begin
        (asserts! (is-eq tx-sender (var-get contract-owner)) ERR_UNAUTHORIZED)
        (asserts! (and (>= new-min MIN_GOVERNANCE_TOKENS) 
                       (<= new-min MAX_GOVERNANCE_TOKENS)) 
                  ERR_INVALID_INPUT)
        (ok (var-set min-governance-tokens new-min))
    )
)

;; Get the current minimum required governance tokens
(define-read-only (get-min-governance-tokens)
    (ok (var-get min-governance-tokens))
)

;; Helper function to get contract owner
(define-data-var contract-owner principal tx-sender)

(define-read-only (get-contract-owner)
    (ok (var-get contract-owner))
)
