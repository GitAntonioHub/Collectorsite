# Enum Values in Collector Site

This document provides information about the enum values used in the Collector Site application.

## ItemStatus

The `ItemStatus` enum represents the current state of a collector item.

- `DRAFT`: Item has been created but is not yet visible to other users
- `AVAILABLE`: Item has been verified and is available for listing
- `LISTED`: Item is currently listed for sale or trade
- `SOLD`: Item has been sold to another user
- `TRADED`: Item has been exchanged in a trade

## ListingStatus

The `ListingStatus` enum represents the current state of a marketplace listing.

- `ACTIVE`: Listing is currently active and available
- `CLOSED`: Listing has been manually closed by the owner
- `CANCELLED`: Listing has been cancelled
- `SOLD`: Item in the listing has been sold
- `TRADED`: Item in the listing has been traded

## VerificationStatus

The `VerificationStatus` enum tracks the verification process for items.

- `PENDING`: Verification request is waiting to be processed
- `APPROVED`: Item has been verified and approved
- `REJECTED`: Item verification has been rejected

## TradeStatus

The `TradeStatus` enum represents the current state of a trade offer.

- `PENDING`: Trade offer has been made but not yet accepted
- `ACCEPTED`: Trade offer has been accepted
- `REJECTED`: Trade offer has been rejected
- `CANCELLED`: Trade offer has been cancelled
- `COMPLETED`: Trade has been completed

## PaymentStatus

The `PaymentStatus` enum represents the current state of a payment.

- `PENDING`: Payment is being processed
- `COMPLETED`: Payment has been completed successfully
- `FAILED`: Payment processing failed
- `REFUNDED`: Payment has been refunded 