Product Name

IoT Sentinel – AI Security Monitoring Dashboard

Product Type

Web Dashboard + Mobile Responsive App

Goal

Design a modern cybersecurity monitoring dashboard that visualizes IoT device trust scores, incidents, alerts, and behavioral anomalies in real time.

The system allows SOC analysts to:

Monitor device trust levels

Detect suspicious behavior

Investigate security incidents

Manage device isolation and maintenance

User Flow
Info Page → Login → Dashboard → Device Monitoring → Incident Investigation
Target Users

Security Analysts (SOC team)

Network Administrators

IT Security Engineers

Core Features
1. Real-time Device Monitoring

Device trust score

Risk classification

Behavior anomaly detection

Status (Active / Isolated / Maintenance)

2. Incident Investigation

Incident details

Evidence logs

Risk explanation

Recommended actions

3. Live Alerts

Real-time notifications

Policy violations

Device status changes

New incidents

4. Graph Network View

Device network topology

Suspicious connections

Lateral movement detection

5. Security Operations Workflow

Incident status workflow

Analyst notes

Clearance timeline

Runbook hints

Screens to Design in Figma
1. Info / Landing Page

Purpose: Introduce the platform.

Sections:

Hero section

Product overview

Features section

CTA buttons

Login button

UI style:

Glassmorphism

Dark cyber aesthetic

Animated elements

Magic scroll transitions

2. Login Screen

Components:

Email field

Password field

Login button

Forgot password

Product logo

UX notes:

Minimal security UI

Dark theme with neon highlights

3. Dashboard Overview

Key Panels:

KPI cards

Risk distribution chart

High-risk devices

Recent incidents

Demo controls

Cards:

Total Devices

Trusted Devices

High Risk Devices

Active Incidents

Charts:

Risk distribution donut chart

Device trust trend

4. Devices List Screen

Components:

Search bar

Risk filters

Device table/cards

Device Card Fields:

Device ID

Device class

Vendor

Trust score

Risk level

Status

Last seen

Filters:

Trusted

Low

Medium

High

Critical

Actions:

Export CSV

Sort devices

5. Device Detail Screen

Sections:

Hero Trust Panel

Large trust score

Risk level badge

Trend indicator

Device Info

Vendor

Device class

MAC address

IP address

Last seen

Score Breakdown

Bars showing:

Behavioral score

Policy score

Drift score

Threat intelligence score

Trust History Chart

Line chart showing:

Score trend

Risk boundaries

Evidence Panel

Evidence cards:

violation type

severity

timestamp

telemetry details

Device Actions

Buttons:

Clear violations

Toggle maintenance

Isolate device

6. Incidents List Screen

Table columns:

Incident ID

Device ID

Risk level

Severity

Status

Recommended action

Created time

Filters:

Status

Severity

Device

Time range

7. Incident Detail Screen

Sections:

Risk Summary

Risk level

Trust score

Confidence level

Device Context

Device ID

Vendor

Current IP

Link to device details

Incident Narrative

Plain-English description of what happened.

Evidence Section

List of events that triggered the incident.

Recommended Action

Example:

VLAN isolation

Firewall block

Adjacent Devices

List of potentially affected devices.

Timeline

Vertical timeline of events.

8. Live Alerts Screen

Real-time streaming alerts.

Alert Types:

Trust score updates

Policy violations

Device status changes

Graph anomalies

New incidents

Controls:

Pause stream

Resume stream

Clear alerts

9. Graph / Topology Screen

Network visualization.

Features:

Node graph of devices

Risk colored nodes

Suspicious edges

Anomaly labels

Interactions:

Click device node → device detail

Click anomaly edge → anomaly info

10. Settings Screen

Sections:

Maintenance Mode

Enable maintenance

Duration selector

Notification Settings

Email alerts

Push alerts

Theme Settings

Light mode

Dark mode

Table density

Design System
UI Style

Dark cybersecurity dashboard

Glassmorphism panels

Neon highlights

Modern analytics UI

Color Palette

Background

#0B0F18

Card Background

#121826

Primary Orange

#F16122

Neon Blue

#00E5FF

Deep Blue

#1082B8

Success

#26AA92

Error

#FF4C4C

Text Primary

#F5F7FF

Text Secondary

#9AA4C6

These palette values come directly from the design guideline section of your uploaded document. 

Here’s a Figma-friendly checkli…

Layout System

12 column grid

8px spacing system

Card radius: 12px

Soft shadow panels

Responsive design

UI Components

Buttons

Primary button

Secondary outline button

Icon buttons

Cards

KPI cards

Device cards

Incident cards

Badges

Risk level badges

Severity badges

Status badges

Charts

Donut chart

Line chart

Bar chart

Mobile Design Notes

Bottom tab navigation:

Devices

Incidents

Alerts

Mobile UI uses:

Cards instead of tables

Pull to refresh

Notification deep links

Figma AI Prompt Version

If you want to generate the UI directly in Figma AI, use this prompt:

Design a modern cybersecurity dashboard UI called "IoT Sentinel".

Style: dark theme, glassmorphism panels, neon blue and orange accents, futuristic SOC dashboard.

Screens:
1. Landing page
2. Login screen
3. Dashboard overview with KPI cards and charts
4. Devices list with filters and device cards
5. Device detail page with trust score and charts
6. Incidents list
7. Incident detail investigation page
8. Live alerts stream
9. Network topology graph visualization
10. Settings page

Components:
device cards, incident cards, risk badges, trust score indicators, line charts, donut charts, alert notifications.

Color palette:
dark background #0B0F18, orange #F16122, neon blue #00E5FF.

Layout:
12 column grid, glass panels, minimal futuristic SOC dashboard.