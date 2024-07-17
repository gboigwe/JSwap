;; Define error codes
(define-constant ERR_INSUFFICIENT_BALANCE (err u1))
(define-constant ERR_TRANSFER_FAILED (err u2))
(define-constant ERR_UNAUTHORIZED (err u3))
(define-constant ERR_INVALID_SWAP_STATUS (err u4))

;; Define the exchange rate (100 STX per 1 BTC)
(define-data-var exchange-rate uint u100)

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
            (stx-amount (* btc-amount (var-get exchange-rate)))
            (sender tx-sender)
            (expiry (+ block-height u144)) ;; Set expiry to ~24 hours (assuming 10-minute blocks)
        )
        (asserts! (not (var-get swap-in-progress)) ERR_INVALID_SWAP_STATUS)
        (asserts! (>= (stx-get-balance sender) stx-amount) ERR_INSUFFICIENT_BALANCE)
        
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
        
        (match (as-contract (stx-transfer? (get stx-amount swap) tx-sender sender))
            success (ok (get stx-amount swap))
            error ERR_TRANSFER_FAILED
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

;; Function to set the exchange rate (only contract owner can call this)
(define-public (set-exchange-rate (new-rate uint))
    (begin
        (asserts! (is-eq tx-sender (contract-owner)) ERR_UNAUTHORIZED)
        (ok (var-set exchange-rate new-rate))
    )
)

;; Get the current exchange rate
(define-read-only (get-exchange-rate)
    (ok (var-get exchange-rate))
)

;; Helper function to get contract owner
(define-data-var contract-owner principal tx-sender)

(define-public (get-contract-owner)
    (ok (var-get contract-owner))
)
