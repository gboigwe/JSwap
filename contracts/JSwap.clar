
;; title: JSwap
;; version: 1.0
;; summary: 
;; description: Smart Contract to swap from BTC(Bitcoin) to STX(Stacks)

;; Define error codes
(define-constant ERR_INSUFFICIENT_BALANCE (err u1))
(define-constant ERR_TRANSFER_FAILED (err u2))

;; Define the exchange rate (100 STX per 1 BTC)
(define-data-var exchange-rate uint u100)

;; Function to swap BTC to STX
(define-public (swap-btc-to-stx (btc-amount uint))
    (let
        (
            (stx-amount (* btc-amount (var-get exchange-rate)))
            (sender tx-sender)
        )
        (if (>= (stx-get-balance sender) stx-amount)
            (match (as-contract (stx-transfer? stx-amount tx-sender sender))
                success (ok stx-amount)
                error ERR_TRANSFER_FAILED
            )
            ERR_INSUFFICIENT_BALANCE
        )
    )
)

;; Function to set the exchange rate (only contract owner can call this)
(define-public (set-exchange-rate (new-rate uint))
    (begin
        (asserts! (is-eq tx-sender (contract-owner)) (err u3))
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
